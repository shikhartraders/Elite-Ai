export default async function handler(req, res) {

  // ONLY POST REQUESTS

  if (req.method !== "POST") {

    return res.status(405).json({

      error: {

        message:
        "Method not allowed"

      }

    });
  }

  try {

    // GET DATA FROM FRONTEND

    const {

      prompt,
      systemPrompt

    } = req.body;

    // OPENROUTER API REQUEST

    const response = await fetch(

      "https://openrouter.ai/api/v1/chat/completions",

      {

        method: "POST",

        headers: {

          "Authorization":
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
          "application/json"

        },

        body: JSON.stringify({

          model:
          "openai/gpt-4o-mini",

          messages: [

            {

              role: "system",

              content:
              systemPrompt

            },

            {

              role: "user",

              content:
              prompt

            }

          ]

        })

      }

    );

    // RESPONSE

    const data =
    await response.json();

    console.log(data);

    // API ERROR

    if (data.error) {

      return res.status(500).json({

        error: {

          message:
          data.error.message

        }

      });
    }

    // SUCCESS

    return res.status(200).json({

      reply:
      data.choices[0]
      .message.content

    });

  } catch (error) {

    console.log(error);

    // SERVER ERROR

    return res.status(500).json({

      error: {

        message:
        "Backend server error"

      }

    });
  }
}
