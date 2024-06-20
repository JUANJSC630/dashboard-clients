import { AccordionFaqs } from "./components/AccordionFaqs";

export default function PageFaqs() {
  return (
    <div className="max-w-4xl p-6 mx-auto rounded-lg shadow-md bg-background">
      <h2 className="mb-8 text-3xl">FAQS</h2>
      <div className="mb-5">
        <p>
          Welcome to our Frequently Asked Questions (FAQ) section designed
          specifically to provide you with quick and clear answers about the
          company dashboard we have developed with passion and dedication.
        </p>
        <p>
          On our FAQs page, you will find a compilation of the most common
          questions our users typically ask about the functionality, features,
          and use of our dashboard. From how to register on the platform to how
          to make the most of its features, we have gathered an exhaustive list
          of questions to offer you the best possible experience.
        </p>
        <p>
          Our team has worked hard to provide detailed and easy-to-understand
          answers to ensure you find the information you need quickly and
          easily. If you do not find the answer you are looking for, do not
          hesitate to contact us. We are here to help you every step of the way.
        </p>
        <p>
          Explore our FAQs and discover how our dashboard can boost your
          company's efficiency and success.
        </p>
      </div>
      <AccordionFaqs />
    </div>
  );
}
