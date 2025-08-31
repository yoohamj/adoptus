import '../../configureAmplify'
import { withSSRContext } from 'aws-amplify'
import { createPet } from '../../graphql/mutations'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })
  try {
    const SEED_CATS = ['BabyKaymak','Kaymak','Jean-Luc','Jodie','Suzette','Hollyhock','Horacio']
    const { API } = withSSRContext({ req })
    let createdCount = 0
    for (const name of SEED_CATS) {
      try {
        const variables = { input: { petType: 'Cat', petName: name, city: 'Toronto', state: 'ON', adoptionFee: '—', photoKeys: [] } }
        const resp = await API.graphql({ query: createPet, variables, authMode: 'AMAZON_COGNITO_USER_POOLS' })
        if (resp?.data?.createPet) createdCount += 1
      } catch {}
    }
    return res.status(200).json({ ok: true, createdCount })
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
