import { useEffect, useState } from "react";
import avatar from "../../assets/images/avatar-1.png";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubscriptionHistoryCard = ({ payerId, paymentDate, amount }) => {
  const [payerData, setPayerData] = useState(null);

  const getPayerData = async () => {
    const res = await axios.get(`${API_BASE_URL}/users/${payerId}`);
    setPayerData(res.data);
  };
  useEffect(() => {
    getPayerData();
  }, []);
  return (
    <>
      <div className="currentSubscription-card mb-4 d-lg-flex justify-content-between align-items-center">
        <div className="d-flex gap-5 align-items-center mb-5 mb-lg-0">
          <img
            src={payerData?.profile_picture || 'https://raw.githubusercontent.com/wfox5510/wordSapce-imgRepo/d618bcfbab915308300f0ac6ccc7db52faa78948/default-avatar.svg'}
            className="avatar object-fit-cover rounded-pill"
            alt="avatar"
          />
          <p className="fw-bold">{payerData?.username}</p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center gap-lg-7">
          <p className="fw-bold">
            {new Date(paymentDate).toLocaleDateString("fr-CA")}
          </p>
          <button className="btn btn-primary-hover text-light" style={{cursor: 'default'}}>
            ${amount}
          </button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionHistoryCard;
