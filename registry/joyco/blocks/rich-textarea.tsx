'use client'

import * as React from 'react'
import type { AnyExtension, JSONContent } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import Document from '@tiptap/extension-document'
import HardBreak from '@tiptap/extension-hard-break'
import Paragraph from '@tiptap/extension-paragraph'
import Placeholder from '@tiptap/extension-placeholder'
import Text from '@tiptap/extension-text'

import { cn } from '@/lib/utils'

export type RichTextareaFeature = {
  // TipTap extensions contributed by the feature.
  extensions: AnyExtension[]
  // Intercept keyboard events; return true to mark as handled.
  keyHandler?: (context: { event: KeyboardEvent }) => boolean
  // Serialize the editor doc into the external string format.
  // Prefer calling base(doc) and only transform your feature's nodes.
  serialize?: (
    doc: ProseMirrorNode,
    base: (doc: ProseMirrorNode) => string
  ) => string
  // Parse the external string format back into a TipTap doc.
  // Prefer delegating to base for non-feature content.
  parse?: (value: string, base: (value: string) => JSONContent) => JSONContent
}

export type RichTextareaHandle = {
  focus: () => void
  clear: () => void
  insertText: (text: string) => void
}

export type RichTextareaProps = {
  value: string
  onChange: (next: string) => void
  onSubmit: () => void
  placeholder?: string
  disabled?: boolean
  extensions?: AnyExtension[]
  features?: RichTextareaFeature[]
  onKeyDown?: (event: KeyboardEvent) => void
  className?: string
  editorClassName?: string
  'aria-label'?: string
}

function serializeDoc(node: ProseMirrorNode) {
  if (node.type.name === 'doc') {
    let output = ''
    node.forEach((child, _, index) => {
      if (index > 0) output += '\n'
      output += serializeDoc(child)
    })
    return output
  }

  if (node.type.name === 'paragraph') {
    let output = ''
    node.forEach((child) => {
      output += serializeDoc(child)
    })
    return output
  }

  if (node.type.name === 'hardBreak') {
    return '\n'
  }

  if (node.isText) {
    return node.text ?? ''
  }

  return ''
}

function pushTextNodesWithBreaks(target: JSONContent[], text: string) {
  const parts = text.split('\n')

  parts.forEach((part, index) => {
    if (part) {
      target.push({ type: 'text', text: part })
    }
    if (index < parts.length - 1) {
      target.push({ type: 'hardBreak' })
    }
  })
}

function parsePlainText(value: string): JSONContent {
  const content: JSONContent[] = []
  pushTextNodesWithBreaks(content, value)

  return {
    type: 'doc',
    content: [
      content.length > 0
        ? { type: 'paragraph', content }
        : { type: 'paragraph' },
    ],
  }
}

export const RichTextarea = React.forwardRef<
  RichTextareaHandle,
  RichTextareaProps
>(
  (
    {
      value,
      onChange,
      onSubmit,
      placeholder,
      disabled = false,
      extensions = [],
      features,
      onKeyDown,
      className,
      editorClassName,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const featureList = React.useMemo(
      () => (features ?? []).filter(Boolean),
      [features]
    )

    const serialize = React.useMemo(() => {
      const baseSerialize = (doc: ProseMirrorNode) => serializeDoc(doc)
      return featureList.reduce(
        (acc, feature) =>
          feature.serialize
            ? (doc: ProseMirrorNode) => feature.serialize!(doc, acc)
            : acc,
        baseSerialize
      )
    }, [featureList])

    const parse = React.useMemo(() => {
      const baseParse = (nextValue: string) => parsePlainText(nextValue)
      return featureList.reduceRight(
        (acc, feature) =>
          feature.parse
            ? (nextValue: string) => feature.parse!(nextValue, acc)
            : acc,
        baseParse
      )
    }, [featureList])

    const lastValueRef = React.useRef(value)

    const editorClasses = React.useMemo(
      () =>
        cn(
          'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:bg-input/30 min-h-12 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          editorClassName
        ),
      [editorClassName]
    )

    const editor = useEditor({
      extensions: [
        Document,
        Paragraph,
        Text,
        HardBreak,
        Placeholder.configure({
          placeholder: placeholder ?? '',
          emptyEditorClass: 'is-editor-empty',
        }),
        ...featureList.flatMap((feature) => feature.extensions),
        ...extensions,
      ],
      content: parse(value),
      editable: !disabled,
      editorProps: {
        attributes: {
          class: editorClasses,
          'data-placeholder': placeholder ?? '',
          'aria-label': ariaLabel ?? 'Message',
          'aria-multiline': 'true',
          role: 'textbox',
        },
        handleKeyDown: (_view, event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || disabled) {
            return true
          }

          for (const feature of featureList) {
            if (feature.keyHandler?.({ event })) {
              return true
            }
          }

          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSubmit()
            return true
          }

          if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault()
            editor?.commands.setHardBreak()
            return true
          }

          return false
        },
        handlePaste: (_view, event) => {
          if (disabled) return true
          const text = event.clipboardData?.getData('text/plain')
          if (!text) return false
          event.preventDefault()
          editor?.commands.insertContent(text)
          return true
        },
      },
      onUpdate: ({ editor }) => {
        const nextValue = serialize(editor.state.doc)
        lastValueRef.current = nextValue
        onChange(nextValue)
      },
    })

    const handleSubmit = React.useCallback(() => {
      if (!editor || disabled) return

      const nextValue = serialize(editor.state.doc)
      if (nextValue.trim().length === 0) return

      onSubmit()

      editor.commands.setContent(
        { type: 'doc', content: [{ type: 'paragraph' }] },
        false
      )
      lastValueRef.current = ''
      onChange('')
    }, [editor, disabled, onSubmit, onChange, serialize])

    React.useEffect(() => {
      if (!editor) return
      editor.setEditable(!disabled)
    }, [editor, disabled])

    React.useEffect(() => {
      if (!editor) return
      if (value === lastValueRef.current) return

      editor.commands.setContent(parse(value), false)
      lastValueRef.current = value
    }, [editor, parse, value])

    React.useImperativeHandle(
      ref,
      () => ({
        focus: () => editor?.commands.focus('end'),
        clear: () => {
          if (!editor) return
          editor.commands.setContent(
            { type: 'doc', content: [{ type: 'paragraph' }] },
            false
          )
          lastValueRef.current = ''
          onChange('')
        },
        insertText: (text: string) => {
          editor?.commands.insertContent(text)
        },
      }),
      [editor, onChange]
    )

    return (
      <div
        className={cn('relative w-full', className)}
        data-disabled={disabled}
      >
        <style>{`
          .is-editor-empty::before {
            content: attr(data-placeholder);
            color: hsl(var(--muted-foreground));
            float: left;
            pointer-events: none;
            height: 0;
          }
        `}</style>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div
            className={cn(editorClasses, 'is-editor-empty')}
            data-placeholder={placeholder ?? ''}
            aria-hidden="true"
          />
        )}
      </div>
    )
  }
)

RichTextarea.displayName = 'RichTextarea'
