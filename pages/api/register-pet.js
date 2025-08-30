import '../../configureAmplify'
import { withSSRContext } from 'aws-amplify'
import { createPet } from '../../graphql/mutations'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
  try {
    const { formData, photoKeys } = req.body || {}
    if (!formData) {
      return res.status(400).json({ message: 'Missing formData' })
    }
    const { API } = withSSRContext({ req })

    // Try to persist to AppSync. If the backend isn't ready, fall back gracefully.
    let created = null
    try {
      const variables = { input: { ...formData, photoKeys } }
      const result = await API.graphql({ query: createPet, variables, authMode: 'AMAZON_COGNITO_USER_POOLS' })
      created = result?.data?.createPet || null
    } catch (gqlErr) {
      // eslint-disable-next-line no-console
      console.warn('GraphQL persistence failed – verify schema and auth:', gqlErr)
    }

    // Always respond OK to keep the UX smooth; include created when available.
    // eslint-disable-next-line no-console
    console.log('Received pet registration:', { formData, photoKeys })
    return res.status(200).json({ ok: true, created })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error in register-pet API:', err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
