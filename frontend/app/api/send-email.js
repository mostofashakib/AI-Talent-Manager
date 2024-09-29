import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, recommendations } = req.body;

    // Prepare email content
    const emailContent = recommendations
      .map(
        (rec) =>
          `${rec.name}: ${rec.description} - Potential earnings: ${rec.earnings}`
      )
      .join("\n\n");

    const formData = {
      access_key: process.env.NEXT_PUBLIC_FORM_CONTACT_API,
      from_name: "YouTube Brand Deal Recommender",
      subject: "Your Brand Deal Recommendations",
      to_email: email,
      message: `Here are your top 20 brand deal recommendations:\n\n${emailContent}`,
    };

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (json.success) {
        res.status(200).json({ message: "Email sent successfully" });
      } else {
        res.status(400).json({ error: json.message });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
