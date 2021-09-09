export default async (secret) => {
  if (secret !== process.env.SECRET_KEY) throw Error('Credential is invalid')
}
