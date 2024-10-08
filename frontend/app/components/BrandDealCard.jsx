import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Copy, ExternalLink } from "lucide-react";

const BrandDealCard = ({ deal }) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const handleCopyContact = () => {
    navigator.clipboard.writeText(deal.contactInfo);
    setIsNotificationVisible(true);
    setTimeout(() => setIsNotificationVisible(false), 3000);
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
      {isNotificationVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white p-2 rounded shadow-lg">
          Contact info copied!
        </div>
      )}

      <CardContent>
        <div className="flex items-center mb-2">
          <img src={deal.logo_url} alt={deal.name} className="w-10 h-10 mr-2" />
          <Typography variant="h6">{deal.name}</Typography>
        </div>
        <Typography variant="body2" color="textSecondary" className="mb-2">
          {deal.description}
        </Typography>
        <Typography variant="body2" className="mb-2">
          Reason: {deal.reason}
        </Typography>
        <Typography variant="body2" className="mb-2">
          Category: {deal.category}
        </Typography>
        {deal.contactInfo && (
          <div className="flex items-center mb-2">
            <Typography variant="body2" className="mr-2">
              Contact: {deal.contactInfo}
            </Typography>
            <Button
              startIcon={<Copy size={16} />}
              size="small"
              onClick={handleCopyContact}
            >
              Copy
            </Button>
          </div>
        )}
        <Button
          startIcon={<ExternalLink size={16} />}
          variant="outlined"
          color="primary"
          fullWidth
          href={deal.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
        >
          Visit Affiliate Program
        </Button>
      </CardContent>
    </Card>
  );
};

export default BrandDealCard;
