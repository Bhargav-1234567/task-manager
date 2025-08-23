// components/Board.tsx
'use client'

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import Container from './Container';
import { Container as ContainerType } from '../types';
import {  Plus } from 'lucide-react'
import Modal from './ui/Modal';
import { useState } from 'react';
import Button from './ui/Button';
import AddContainerForm from './Forms/AddContainerForm';

interface BoardProps {
  containers: ContainerType[];
  activeId: string | null;
}

export default function Board({ containers, activeId }: BoardProps) {
  const { setNodeRef } = useDroppable({
    id: 'board',
  });
  const [isOpenAddModel,setIsOpenAddModel]=useState(false)

  return (
    <div ref={setNodeRef} className="flex gap-4 overflow-x-auto pb-4">
      {/* <SortableContext items={containers.map(c => c.id)} strategy={horizontalListSortingStrategy}> */}
        {containers.map((container) => (
          <Container
            key={container.id}
            container={container}
            activeId={activeId}
          />
        ))}
      {/* </SortableContext> */}
      <div className='shrink-0 w-64 flex gap-1 h-10'>
        <Button variant='ghost' icon={ <Plus height={'20px'}/> }  onClick={()=>setIsOpenAddModel(true)} className='font-medium text-sm
 text-gray-500 flex items-center gap-1'>Add Container</Button>
          </div>
<Modal onClose={()=>setIsOpenAddModel(false)} isOpen={isOpenAddModel}>
  <AddContainerForm/>
   </Modal>
    </div>
  );
}