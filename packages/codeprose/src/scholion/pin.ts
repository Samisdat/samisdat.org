export function initScholionPin(): () => void {
    function handleClick(e: MouseEvent) {
        const el = (e.target as Element).closest('[data-ref]')

        if (!el) {
            if (!(e.target as Element).closest('[data-explains]')) {
                document.documentElement.removeAttribute('data-scholion-pin')
            }
            return
        }

        const id = el.getAttribute('data-ref')!
        const current = document.documentElement.getAttribute('data-scholion-pin')

        if (current === id) {
            document.documentElement.removeAttribute('data-scholion-pin')
            e.preventDefault()
        } else {
            document.documentElement.setAttribute('data-scholion-pin', id)
        }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
}
