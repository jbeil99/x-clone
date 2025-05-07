import React, { useCallback } from 'react';
import Modal from './Modal';
import TweetForm from '../../pages/main-page/components/TweetForm';

export default function TweetModal({ isOpen, onClose }) {
  // Callback to handle successful tweet submission
  const handleTweetSuccess = useCallback(() => {
    // Close the modal after successful tweet
    onClose();
  }, [onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a post">
      <TweetForm onSuccess={handleTweetSuccess} />
    </Modal>
  );
}
