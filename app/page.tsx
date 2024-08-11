import LnPaymentForm from "./components/LnPaymentForm";
import User from "./components/User";

const HomePage = () => {
  return (
    <div style={{ display: 'block', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <User />
      </div>
      <div>
        <LnPaymentForm />
      </div>
    </div>
  );
};

export default HomePage;
