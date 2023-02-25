import { useCallback, useMemo } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export type Page = {
    page: 'home'
} | {
    page: 'e1'
}

const useRoute = () => {
    const location = useLocation()
    const navigate = useNavigate()

    const path = location.pathname
    const page: Page = useMemo(() => (
        path === '/e1' ? ({page: 'e1'}) :
        ({page: 'home'})
    ), [path])

    const setPage = useCallback((page: Page) => {
        if (page.page === 'home') {
            navigate({...location, pathname: '/'})
        }
        else if (page.page === 'e1') {
            navigate({...location, pathname: '/e1'})
        }
    }, [location, navigate])

    return {page, setPage}
}

export default useRoute