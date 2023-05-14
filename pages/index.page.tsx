import Link from 'next/link'

export default function IndexPage() {
  return (
    <div>
      Hello World. <Link href="/about">About</Link>
      <div>
        Click <Link href="/grid">here</Link> to access the selective grid.
      </div>
      <div>
      Click <Link href="/gpt">here</Link> to access the experimental gpt page.
      </div>
    </div>
  )
}
