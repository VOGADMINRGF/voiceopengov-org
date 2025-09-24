import ContactForm from "@/components/ContactForm";


export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
return (
<section className="section">
<h1 className="text-2xl font-bold mb-4">Kontakt</h1>
<ContactForm />
</section>
);
}