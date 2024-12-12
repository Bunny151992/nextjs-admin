"use client"
import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image'

import wornning from "@/public/components/wornning/wornning.svg";

export default function WarningComponents({ title, warrning, onView, deleteddata, onClose, onsubmit }) {

    return (
        <Modal isOpen={onView} hideCloseButton className='rounded-3xl'>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 pt-6 pb-3 items-center">
                    <Image src={wornning} alt='wornning' width={60} height={60} />
                </ModalHeader>
                <ModalBody>
                    <div className='text-center text-2xl font-semibold'>{title}</div>
                    <p className='text-center px-16'>{warrning}</p>
                </ModalBody>
                <ModalFooter className='mb-2'>
                    <Button color="default" radius="full" className='w-full' onPress={onClose}>No, Keep It.</Button>
                    <Button color="danger" radius="full" className='w-full' onPress={() => onsubmit(deleteddata)} type="submit">Delete</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}