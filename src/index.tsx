/* @refresh reload */
import { assignmentsReady } from './AssignmentLoader.tsx'
import { render } from 'solid-js/web'
import { A, Route, Router, type RouteSectionProps } from '@solidjs/router'
import Home from './routes/Home.tsx'
import Assignment from './routes/Assignment.tsx'
import Playground from './routes/Playground.tsx'
import AssignmentBuilder from './routes/AssignmentBuilder.tsx'
import './index.css'

if (!assignmentsReady) {
	throw new Error('Assignments not ready')
}

const root = (props: RouteSectionProps<unknown>) => (
	<>
		<header>
			<h1>🧑‍💻 Yaclt</h1>
			<nav style='display: flex; gap: 1rem;'>
				<A href='/'>Home</A>
				<A style='display: none; /* Hide playground for now */' href='/Playground'>Playground</A>
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
		<Route path='builder' component={AssignmentBuilder} />
		<Route path='*missingPage' component={Home} />
	</Router>
), document.body!)
