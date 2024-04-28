## Just JS things

### 1. What is the difference between Component and PureComponent? Give an example where it might break my app.

The major difference between PureComponent and Component is PureComponent does a shallow comparison on state change. It means that when comparing scalar values it compares their values, but when comparing objects it compares only references. It helps to improve the performance of the app. Component on the other hand won’t compare current props and state to next out of the box. Thus, the component will re-render by default whenever shouldComponentUpdate is called.

### 2. Context + ShouldComponentUpdate might be dangerous. Why is that?

Assume that there are top, middle and bottom component, and bottom component uses context provided by top component. Now, when context at top level component is updated, it might happen that middle component will block the re-render of bottom component, if ShouldComponentUpdate returns falsy, as no prop has been changed for it. ideally, components should receive context only once; when they are constructed.

### 3. Describe 3 ways to pass information from a component to its PARENT.

- calling a function from child component, passed as prop from parent earlier. example, `props.handleParentStateFromChild({childData})`
- using a context API/hook. A context hook can be used as a 2-way binding solution, as each component under Context.Provider is listening to Context, change in it will re-render all the components using that context. Only thing is that the Context should expose a function to update it's state
- Pub/sub pattern using stores, using `redux/recoil`, or `useReducer` hooks

### 4. Give 2 ways to prevent components from re-rendering.

- if you are not using hook, then make sure that you do not do setState unnecessary, you can use shouldComponentUpdate to compare props
- mainly, do not change a state passed to Component 1 if we need to render change only inside Component 2
- you can use useMemo hook to avoid re-rendering
- use useCallback to not re-create functions on the change of props/state variables on which that functions defination is not dependent

### 5. What is a fragment and why do we need it? Give an example where it might break my app.

- **React.Fragment** is used to wrap multiple components together in a stack, without adding an extra DOM element node, short use- `<>`,
- if you are using a CSS selector that relies on parent child relationship, it will break;

### 6. Give 3 examples of the HOC pattern.

- Theme based HOC - if we want to apply themes to a component we can use these as HOC

```
const CustomDiv = (props) => {(
    <div style={{ backgroundColor: props.theme.primaryColor, color: props.theme.textColor }}>
      Rendered with theme.
    </div>
  );
};

export default useTheme(CustomDiv);


const useTheme = (Component) => {

  const theme = {...defaultTheme}

  return <><Component {...props} theme={theme} /></>;
};

```

- with styled components HOC, or with screen viewport based HOC
- with state management hooks provider, like withStores, etc.
- with Auth or data-fetching HOCs

### 7. What's the difference in handling exceptions in promises, callbacks and async…await?

- In Callbacks, we follow error-first approach and if we are not using any third-party or pre-defined functions then we have to handle errors ourselves

  ```
    (error, data) => {
      if (error) {
      // exceptions
        throw new Error(error)
      }
    }
  ```

- In Promises, we have to use .catch based syntax

  ```
    .then()
    .catch(error => {
      // exceptions
    });
  ```

- In Async/Await, we use try catch absed syntax

  ```
    try {
    } catch (error) {
      // exceptions
    }
  ```

8. How many arguments does setState take and why is it async.

- It takes 2 arguments, 1st argument can be a partial change object or a function having params as prevState and newProps.

```
  this.setState((prevState, newProps) => {

    return {...prevState, ...newProps}
  });
```

- It is async to reduce number of re-render for multiple setState, by calculating which DOM nodes to re-render

### 9. List the steps needed to migrate a Class to Function Component.

- we will hooks in this case, pass all the props to Function component, props can be used directly in function component body
- replace all the state variables with useState hook and create new constants variable using that, update event handlers and other methods to use the new state variables.
- add useEffect hooks if your state variable have dependency on any of the prop, mainly for `componentDidUpdate`
- if your component has `componentDidMount` lifecycle method, use `useEffect(()=>{},[])` with **empty array** dependency
- If you want to run a hook on each-re-render use, `useEffect(()=>{})`, with no depndency array
- replace all this.eventHandlers with functions present in the component body
- if using context, then replace it with `useContext` hooks
- remove class related syntax and replace render with return of jsx
- check imports and exports

### 10.List a few ways styles can be used with components.

- inline styles, in react we can pass inline styles as CSSObjects

```
<Comp style={{color: 'red'}}>
```

- we can import a css file using import './styles.css'
- CSS as styled components using `styled-components` lirary
- CSS in JS like `material-ui, emotion`

### 11. How to render an HTML string coming from the server.

- We should not use this, but we can render it using

```
<div dangerouslySetInnerHTML={{__html: '<strong>strong text</strong>'}} />

// <strong>strong text</strong> is returned from server.
```
