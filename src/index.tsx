/* @refresh reload */
import { assignmentsReady } from './AssignmentLoader.tsx'
import { render } from 'solid-js/web'
import { A, Route, Router, type RouteSectionProps } from '@solidjs/router'
import Home from './routes/Home.tsx'
import Assignment from './routes/Assignment.tsx'
import Playground from './routes/Playground.tsx'
import AssignmentBuilder from './routes/AssignmentBuilder.tsx'
import './index.css'
import CustomAssignments from './routes/CustomAssignments.tsx'

if (!assignmentsReady) {
	throw new Error('Assignments not ready')
}

const root = (props: RouteSectionProps<unknown>) => (
	<div class='app-root'>
		<header class='app-header'>
			<div class='app-header-inner'>
				<A href='/' class='app-logo'>
					<span aria-hidden='true'>🧑‍💻</span>
					Yaclt
				</A>
				<nav class='app-nav'>
					<A href='/' style={{ display: props.location.pathname === '/' ? 'none' : 'block' }}>Home</A>
					<A href='/Playground' style='display: none; /* Hide until implemented */'>Playground</A>
				</nav>
			</div>
		</header>
		<main>{props.children}</main>
	</div>
)

render(() => (
	<Router root={root}>
		<Route path='' component={Home} />
		<Route path='Assignment/*path' component={Assignment} />
		<Route path='Playground' component={Playground} />
		<Route path='builder/:assignmentId?' component={AssignmentBuilder} />
		<Route path='CustomAssignments/*assignmentPaths' component={CustomAssignments} />
		<Route path='*missingPage' component={Home} />
	</Router>
), document.body!)
