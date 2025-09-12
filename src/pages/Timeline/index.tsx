import { useQuery } from '@tanstack/react-query'
import * as d3 from 'd3'
import { fetchHeartRate } from '../../state/api'

export const Timeline = () => {
  const now = new Date()
  const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000) // Start fetching 1 day ago

  // Use TanStack Query to fetch heart rate data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['heartRate', 'lastDay'],
    queryFn: () => fetchHeartRate(lastDay, now), // Fetch data with the API function
    staleTime: 10 * 60 * 1000, // Cache data for 10 minutes
    // cacheTime: 60 * 60 * 1000, // Keep unused data in cache for 1 hour
  })

  if (isLoading) {
    return <div>Loading Heart Rate...</div>
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>
  }

  return (
    <>
      <div class="timeline">
        <h1>Heart Rate Timeline</h1>
        <LineChart data={data || []} />
      </div>
    </>
  )
}

function Resource(props) {
  return (
    <a href={props.href} target="_blank" class="resource">
      <h2>{props.title} </h2>
      <p> {props.description} </p>
    </a>
  )
}

function LineChart({ data }: { data: [Date, number][] }) {
  const margin = { top: 10, right: 20, bottom: 20, left: 30 }
  const width = 800
  const height = 400

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => new Date(d[0])) as [Date, Date])
    .range([margin.left, width - margin.right])

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])] as [number, number])
    .range([height - margin.bottom, margin.top])

  return (
    <svg width={width} height={height}>
      <path
        fill="none"
        stroke="red"
        strokeWidth="2"
        d={d3
          .line<[Date, number]>()
          .x((d) => x(new Date(d[0])))
          .y((d) => y(d[1]))(data)}
      />
      <g
        transform={`translate(${margin.left},0)`}
        ref={(g) => {
          if (g) d3.select(g).call(d3.axisLeft(x))
        }}
      />
      <g
        transform={`translate(0,${height - margin.bottom})`}
        ref={(g) => {
          if (g) d3.select(g).call(d3.axisBottom(x))
        }}
      />
    </svg>
  )
}
