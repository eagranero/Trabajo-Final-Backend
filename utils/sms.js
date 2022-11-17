import twilio from 'twilio'

const accountSid = 'ACdf0a9b2e360d810110b82ebdcb32da9f'
const authToken = 'be9de4f2fd8535e2e44bbeb91a776971'

const client = twilio(accountSid, authToken)


export const smsCompraExitosa = async (numero)=>{
    try {
    const message = await client.messages.create({
        body: 'Hola, tu pedido ha sido recibido y se encuentra en proceso!',
        from: '+14632639877',
        to: '+54'+numero 
    })
    console.log(message)
    } catch (error) {
    console.log(error)
    }
}