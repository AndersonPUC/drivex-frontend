export default date => {
	if (!date) return null
	const [year, month, day] = date.split('-')
	return `${day.substring(0, 2)}/${month}/${year}`
}
