import { signal } from '@preact/signals'
import * as d3 from 'd3'
import { authState, login } from '../../auth'

// import "./style.css";

const timelineData = signal([
  { x: 0, y: 10 },
  { x: 10, y: 40 },
  { x: 20, y: 30 },
  { x: 30, y: 70 },
  { x: 40, y: 0 },
])

export const Timeline = () => {
  const { auth } = authState()

  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const target = e.currentTarget
    await login(formData.get('user'), formData.get('pass'))
    target.reset() // Clear the inputs to prepare for the next submission
  }

  const userInfo = auth.value.user ? (
    <p>User: {auth.value.user}</p>
  ) : (
    <form onSubmit={onSubmit}>
      <input name="user" />
      <input type="password" name="pass" />
      <button>Login</button>
    </form>
  )
  return (
    <div>
      {userInfo}
      <div class="timeline">
        <h1>Time Line</h1>

        <LineChart data={timelineData} />
      </div>
    </div>
  )
}

function Resource(props) {
  return (
    <a href={props.href} target="_blank" class="resource">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </a>
  )
}

function LineChart({ data: { v: data } }) {
  const margin = { top: 10, right: 20, bottom: 20, left: 30 }
  const width = 500
  const height = 300

  console.log('vvvv', data.v)

  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.x)])
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.y)])
    .range([height - margin.bottom, margin.top])

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="#33C7FF"
        stroke-width="2"
        d={d3
          .line()
          .x((d) => x(d.x))
          .y((d) => y(d.y))(data)}
      />
      <g transform="translate(${margin.left},0)" ref={(g) => d3.select(g).call(d3.axisLeft(y))} />
      <g transform="translate(0,{height - margin.bottom})" ref={(g) => d3.select(g).call(d3.axisBottom(x))} />
    </svg>
  )
}
