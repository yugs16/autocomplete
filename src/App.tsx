import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Layout from './Layout';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1 className="">AutoComplete</h1>
			{/* <h1>sakljksad asdjkasdjkds</h1> */}
			<Layout></Layout>
		</>
	);
}

export default App;
