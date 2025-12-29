---
reference: https://registry.joyco.studio/toolbox/pr-guidelines#context-over-prop-drilling
---

# Context Over Prop Drilling

### What

Use React Context to share state and callbacks across deeply nested components instead of passing props through multiple intermediate layers. When callbacks involve logic that primarily uses context values, define them inside the context provider and expose them through the context.

### Why

Prop drilling creates tight coupling between components, makes refactoring painful, and clutters component signatures with props that are merely "passed through." Context centralizes shared state and logic, making components cleaner and the data flow more maintainable.

### Good

```jsx
// AuthContext.jsx
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (credentials) => {
    setIsLoading(true)
    const userData = await authApi.login(credentials)
    setUser(userData)
    setIsLoading(false)
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// DeepNestedComponent.jsx
const DeepNestedComponent = () => {
  const { user, logout } = useAuth()
  return <button onClick={logout}>Logout {user.name}</button>
}
```

### Bad

```jsx
// Prop drilling through multiple layers
const App = () => {
  const [user, setUser] = useState(null)

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  return <Layout user={user} logout={logout} />
}

const Layout = ({ user, logout }) => <Sidebar user={user} logout={logout} />

const Sidebar = ({ user, logout }) => <UserMenu user={user} logout={logout} />

const UserMenu = ({ user, logout }) => (
  <button onClick={logout}>Logout {user.name}</button>
)
```
