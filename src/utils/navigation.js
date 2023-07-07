const checkIsNavigationSupported = () => {
    return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
    // get html and read it as text
    const response = await fetch(url)
    const text = await response.text()

    // get only the body from html
    const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
    // console.log(data)
    return data
}

export const startViewTransition = () => {

    if (!checkIsNavigationSupported()) return

	window.navigation.addEventListener('navigate', (event) => {
		// console.log(event.destination.url)
	
		const toUrl = new URL(event.destination.url)
	
		// if destination is a different url, ignore
		if (location.origin !== toUrl.origin) return
	
		// else intercept and fetch the destination route
		event.intercept({
			async handler () {
				const data = await fetchPage(toUrl.pathname)
	
				document.startViewTransition(() => {
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}