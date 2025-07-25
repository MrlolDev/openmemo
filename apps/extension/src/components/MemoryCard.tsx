import React from 'react';
import { MemoryCard as SharedMemoryCard, type Memory } from '@repo/ui';

interface MemoryCardProps {
  memory: Memory;
  onDelete: () => void;
  onFindSimilar?: () => void;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onDelete, onFindSimilar }) => {
  return (
    <SharedMemoryCard
      memory={memory}
      onDelete={onDelete}
      onFindSimilar={onFindSimilar}
      appName="extension"
      maxContentLength={100}
    />
  );
};

export default MemoryCard;