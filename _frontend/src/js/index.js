import axios from 'axios'

$(() => {
  console.log('JavaScript initialized')
  ;(async () => {
    console.log(await axios.get('https://www.jatai.go.leg.br/api/version'))
  })()
})
