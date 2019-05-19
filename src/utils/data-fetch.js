import React, {useState, useEffect} from 'react';

export function useAsyncData(fn, deps) {
  const [data, setData] = useState()
  const [error, setError] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await fn()
        setData(data)
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [fn])

  return [data, loading, error]
}

export function Async({ fn, deps, onData }) {
  const [data, loading, error] = useAsyncData(fn, deps)

  if (loading) {
    return "Loading..."
  }

  if (error) {
    return (
      <div>Error: {JSON.stringify(error)}</div>
    )
  }
  
  return onData(data)
}
