import { useEffect } from 'react'
import Loading from '../reusable/loading';

export const Redirect = ({url}) => {

    useEffect(() => {
        window.location.replace(url);
      }, [])

  return (
    <Loading text='Redirecting...'></Loading>
  )
}
