
# Tranquil

A CBT-based journaling app with AI integration to help combat social anxiety.

## Table of Contents
- [Inspiration](#inspiration)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Challenges](#challenges)
- [Accomplishments](#accomplishments)
- [What We Learned](#what-we-learned)
- [What's Next](#whats-next)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Inspiration
Social anxiety is a significant issue, affecting 16 million people in Indonesia. It impacts personal relationships, professional opportunities, and overall quality of life. Despite available help from psychologists, many are afraid to seek assistance. Existing chatbots often provide limited help due to minimal prompt engineering. This inspired us to build Tranquil, a journaling app based on Cognitive Behavioral Therapy (CBT) with AI integration.

## Features
- **CBT-Based Journaling**: Proven techniques to combat social anxiety, including Reframing Negative Thoughts, Savoring Positivity, and Exposure Hierarchy Powered by Fine-Tuned GPT-4.
- **Tone Recognition**: AI understands and responds to user expressions based on their tone, fostering confidence in communication.
- **Analytics & Gamification**: Track progress and enjoy a gamified experience to make the journey more engaging.
- **Specialist Integration**: Summarizes user journaling for mental health specialists to provide better, faster help.

## Tech Stack
- **Design**: Figma
- **AI Model**: GPT-4 fine-tuned with mental health specialist conversations
- **Authentication**: Clerk
- **Database**: Supabase
- **Web Technologies**: Next.js, Typescript, TRPC, React-Query, Shadcn UI, Tailwind

## Challenges
Time constraints were the most significant challenge. Prioritizing features required difficult decisions about what to cut and what to keep. Many discussions led us to effective solutions.

## Accomplishments
We progressed from having no hackathon experience to building a functional product. It was a challenging but rewarding journey.

## What We Learned
Hackathons are not just about coding; they're about fun and collaboration. We enjoyed meeting diverse people and improved our communication and teamwork skills.

## What's Next
We plan to complete the remaining features and continuously improve Tranquil, making it more effective and user-friendly.

## Installation
To run Tranquil locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/emrsyah/tranquil.git
    cd tranquil
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory and add your environment variables.

   (OPEN AI API, HUME API, SUPABASE API, CLERK API)

5. Start the development server:
    ```bash
    npm run dev
    ```

## Usage
Once the development server is running, open your browser and navigate to `http://localhost:3000` to start using Tranquil.

## Contributing
We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
