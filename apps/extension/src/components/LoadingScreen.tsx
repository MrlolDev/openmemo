import React from 'react';
import { LoadingScreen as SharedLoadingScreen } from '@repo/ui';

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading memories...", 
  submessage 
}) => {
  return (
    <SharedLoadingScreen
      message={message}
      submessage={submessage}
      fullScreen={true}
      background={true}
      size="lg"
      variant="spinner"
      color="primary"
      className="w-full h-full m-0 p-0"
    />
  );
};

export default LoadingScreen;