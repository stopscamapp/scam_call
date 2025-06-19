import axios from "axios";

class BulksServise{
    async checkNumber(number:string):Promise<string>{
        try {
            const response = await axios.get(
                `https://cnam.bulkcnam.com/?id=${process.env.BULKVS_KEY}&did=${number}`
            )
            const data =  response.data as string;
        return data;
        } catch (error) {
            return "OK"
        }
    }
}

export default new BulksServise();