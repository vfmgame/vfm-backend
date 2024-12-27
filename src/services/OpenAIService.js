const OpenAI = require("openai");
const fetch = require("node-fetch-commonjs");
const Secrets = require("../config");
const openai = new OpenAI({
  apiKey: Secrets.OPENAI_KEY, // This is the default and can be omitted
});

module.exports = class OpenAIService {
  constructor(rewritemodel) {
    this.rewritemodel = rewritemodel;
  }


  async RewriteAI(data) {
    console.log(data);
    const template = await this.rewritemodel.findOne({ id: data.template_id })

    let content = null
    let response = null;

    if(template.name == "Complete" || template.name == "Shorten") {
      content = `${template.name} this sentence ${data.text}`
    } else if(template.name == "Generate a hook" || template.name == "Generate a CTA" || template.name == "Improve Structure" ) {
      content = `${template.name} from this sentent ${data.text}`
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [{ role: 'user', content }]
    },
      { responseType: 'stream' }
    );

    console.log(stream);

    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '');
      response = chunk.choices[0]?.delta?.content || '';
    }

    return response;
  }


  async Write(data, res) {

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Secrets.OPENAI_KEY}`,
          },
          // We need to send the body as a string, so we use JSON.stringify.
          body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                  {
                      role: "user",
                      // The message will be 'Say hello.' unless you provide a message in the request body.
                      content: ` ${data.instruction || "Say hello."}`,
                  },
              ],
              temperature: 0,
              max_tokens: 25,
              n: 1,
              stream: true,
          }),
      }
    );

    //console.log(response.body);

    return response
    
    // const response = openai.chat.completions.create(
    //   {
    //     model: 'gpt-3.5-turbo',
    //     stream: true,
    //     messages: [
    //       // {
    //       //   role: 'system',
    //       //   content: 'You are an SEO expert.',
    //       // },
    //       {
    //         role: 'user',
    //         content: data.instruction,
    //       },
    //     ],
    //   },
    //   { responseType: 'stream' }
    // )

    // let response;

    // const stream = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   stream: true,
    //   messages: [{ role: 'user', content: data.instructions.user_input[0] }]
    // }
    // );
  //   const response = await fetch(
  //     "https://api.openai.com/v1/chat/completions",
  //     {
  //         method: "POST",
  //         headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${Secrets.OPENAI_KEY}`,
  //         },
  //         // We need to send the body as a string, so we use JSON.stringify.
  //         body: JSON.stringify({
  //             model: "gpt-3.5-turbo",
  //             messages: [
  //                 {
  //                     role: "user",
  //                     // The message will be 'Say hello.' unless you provide a message in the request body.
  //                     content: ` ${data.instructions.user_input[0]}`,
  //                 },
  //             ],
  //             temperature: 0,
  //             max_tokens: 25,
  //             n: 1,
  //             stream: true,
  //         }),
  //     }
  // );

    //console.log(stream.controller);

    // stream.on('content', (delta, snapshot) => {
    //   process.stdout.write(delta);
    // });

    // for await (const chunk of stream) {
    //   process.stdout.write(chunk.choices[0]?.delta?.content || '');
    //   response = chunk.choices[0]?.delta?.content || '';
    // }
    // const chatCompletion = await stream.finalChatCompletion();
    // console.log(chatCompletion); // {id: "…", choices: […], …}
    // console.log(response);

    //res.write(response)

    //return response


  //   const completion = await openai.chat.completions.create(
  //     {
  //       model: "gpt-3.5-turbo",
  //       messages: [
  //           {
  //               role: "user",
  //               // The message will be 'Say hello.' unless you provide a message in the request body.
  //               content: ` ${data.instructions.user_input[0]}`,
  //           },
  //       ],
  //       temperature: 0,
  //       max_tokens: 25,
  //       stream: true,
  //     },
  // );
  // return new Promise((resolve) => {
  //     let result = "";
  //     completion.data.on("data", (data) => {
  //         const lines = data
  //             ?.toString()
  //             ?.split("\n")
  //             .filter((line) => line.trim() !== "");
  //         for (const line of lines) {
  //             const message = line.replace(/^data: /, "");
  //             if (message == "[DONE]") {
  //                 resolve(result);
  //             } else {
  //                 let token;
  //                 try {
  //                     token = JSON.parse(message)?.choices?.[0]?.text;
  //                 } catch {
  //                     console.log("ERROR", json);
  //                 }
  //                 result += token;
  //                 if (token) {
  //                   console.log(token);
  //                 }
  //             }
  //         }
  //     });
  // });

    // stream.then((resp) => {
    //   resp.data.on('data', (chunk) => {
    //     // console.log the buffer value
    //     console.log('chunk: ', chunk)
        
    //     // this converts the buffer to a string
    //     const payloads = chunk.toString().split('\n\n')
  
    //     console.log('payloads: ', payloads)
  
    //     for (const payload of payloads) {
    //       // if string includes '[DONE]'
    //       if (payload.includes('[DONE]')) {
    //         res.end() // Close the connection and return
    //         return
    //       }
    //       if (payload.startsWith('data:')) {
    //         // remove 'data: ' and parse the corresponding object
    //         const data = JSON.parse(payload.replace('data: ', ''))
    //         try {
    //           const text = data.choices[0].delta?.content
    //           if (text) {
    //             console.log('text: ', text)
    //             // send value of text to the client
    //             res.write(`${text}`)
    //           }
    //         } catch (error) {
    //           console.log(`Error with JSON.parse and ${payload}.\n${error}`)
    //         }
    //       }
    //     }
    //   })
    // })

    // console.log(data);
    // const stream = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   stream: true,
    //   messages: [{ role: 'user', content: data.instructions.user_input[0] }]
    // });

    // res.writeHead(200, {
    //   'Content-Type': 'text/plain',
    //   'Transfer-Encoding': 'chunked'
    // });


    // for await (const chunk of stream) {
    //   res.write(chunk.choices[0]?.delta?.content || "");
    //   console.log(`Sent: ${chunk}`);
    // }

    // return res.end();
  }
}

