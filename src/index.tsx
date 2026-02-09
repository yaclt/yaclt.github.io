/* @refresh reload */
import { render } from 'solid-js/web'
import { A, Route, Router, type RouteSectionProps } from '@solidjs/router'
import Home from './routes/Home.tsx'
import Assignment from './routes/Assignment.tsx'
import './AssignmentBuilder.tsx'
import Playground from './routes/Playground.tsx'

const root = (props: RouteSectionProps<unknown>) => (
	<>
		<header>
			<h1>Learn to code</h1>
			<nav style='display: flex; gap: 1rem;'>
				<A href='/'>Home</A>
				<A href='/Playground'>Playground</A>
			</nav>
		</header>
		<main>
			{props.children}
		</main>
	</>
)

render(() => (
	<Router root={root}>
		<Route path='' component={Home} />
		<Route path='Assignment/*path' component={Assignment} />
		<Route path='Playground' component={Playground} />
		<Route path='*missingPage' component={Home} />
	</Router>
), document.body!)
