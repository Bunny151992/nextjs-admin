'use client'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";

import Datatable from "@/app/component/datatable";
import Warning from "@/app/component/warning";

const columns = {
    image: { name: "Image", uid: "image", sortable: false, callview: 'image' },
    introduction: { name: "Name", uid: "introduction", sortable: true, callview: '' },
    age: { name: "Age", uid: "age", sortable: true, callview: '' },
    gender: { name: "Gender", uid: "gender", sortable: true, callview: '' },
    experience: { name: "Experience", uid: "experience", sortable: true, callview: '' },
    phonenumber: { name: "Number", uid: "phonenumber", sortable: true, callview: '' },
    actions: { name: "Actions", uid: "actions", sortable: false, callview: "actions" },
};
const actionlist = ['edit', 'delete'];

export default function Users() {

    const [User, setUser] = useState([]);
    const [deleteprofile, setDeleteprofile] = useState({ isdelete: false, deldata: {} });
    const EditUserPopup = useDisclosure();
    const objupdateuser = { id: '', about: '', age: '', describe: '', email: '', experience: '', gender: '', image: '', introduction: '', jobtitle: '', patientcount: '', phonenumber: '', qualifications: '', status: '', profileimg: null };
    const [updateuser, setUpdateUser] = useState(objupdateuser);
    const [ErrorForm, setErrorForm] = useState(objupdateuser);

    const UpdateuserOnchange = (e) => {
        const { name, value } = e.target;
        if (value) {
            setErrorForm({ ...ErrorForm, [name]: '' })
        }

        if (name == 'profileimg') {
            setUpdateUser({ ...updateuser, ['profileimg']: e.target.files[0] });
        } else {
            setUpdateUser({ ...updateuser, [name]: value });
        }
    }

    const actionedit = (data) => {
        switch (data.type) {
            case 'delete':
                setDeleteprofile({ isdelete: true, deldata: data.data })
                break;
            case 'edit':
                EditUserPopup.onOpen();
                setUpdateUser({ ...updateuser, ...data.data })
                break;
            default:
                break;
        }
    }

    const DelectAction = (data) => {
        setDeleteprofile({ isdelete: false, deldata: {} })

        var myHeaders = new Headers();
        myHeaders.append("Authorization", Cookies.get('_ut'));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`${process.env.apiurl}/admin/v1/doctor/delete/${data.id}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (!result.res) {
                    toast.error(result.msg)
                } else {
                    setUser(User.filter(item => item.id != data.id))
                    toast.success('Delete Successfully')
                }
            }).catch(error => console.log('error', error));
    }

    const updateuserAction = () => {
        let ischack = true;

        if (!updateuser.age) {
            ErrorForm.age = 'Age is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.gender) {
            ErrorForm.gender = 'Gender is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.introduction) {
            ErrorForm.introduction = 'Name is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.experience) {
            ErrorForm.experience = 'Experience is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.patientcount) {
            ErrorForm.patientcount = 'Patient Count is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.qualifications) {
            ErrorForm.qualifications = 'Qualifications is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.phonenumber) {
            ErrorForm.phonenumber = 'Phone Number is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.about) {
            ErrorForm.about = 'About is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.jobtitle) {
            ErrorForm.jobtitle = 'Job Title is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }
        if (!updateuser.describe) {
            ErrorForm.describe = 'Describe is Requild';
            setErrorForm({ ...ErrorForm })
            ischack = false;
        }

        if (ischack) {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", Cookies.get('_ut'));

            var formdata = new FormData();
            formdata.append("email", updateuser.email);
            formdata.append("gender", updateuser.gender);
            formdata.append("introduction", updateuser.introduction);
            formdata.append("experience", updateuser.experience);
            formdata.append("patientcount", updateuser.patientcount);
            formdata.append("qualifications", updateuser.qualifications);
            formdata.append("phonenumber", updateuser.phonenumber);
            formdata.append("about", updateuser.about);
            formdata.append("jobtitle", updateuser.jobtitle);
            formdata.append("describe", updateuser.describe);
            formdata.append("id", updateuser.id);
            formdata.append("age", updateuser.age);
            formdata.append("dprofileimg", updateuser.profileimg);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };

            fetch(`${process.env.apiurl}/admin/v1/doctor/profile/update`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (!result.res) {
                        toast.error(result.msg)
                    } else {
                        toast.success('Update Successfully')
                        setUser(User.map(item => item.id == updateuser.id ? { ...item, ...result.data } : item))
                    }
                    setUpdateUser(objupdateuser);
                    EditUserPopup.onClose();
                }).catch(error => console.log('error', error));
        }
    }

    return (
        <div className='sm:pt-5 sm:pl-5'>
            <h1 className="text-2xl font-semibold">User</h1>
            <div className='max-sm:pt-5 sm:p-5'>
                <Datatable columndata={columns} rowdata={User} selecttype='single' actionlist={actionlist} onActionclick={actionedit} />
                <Warning
                    title='Delete Doctor'
                    warrning="You're going to delete this User. Are you sure?"
                    onView={deleteprofile.isdelete}
                    deleteddata={deleteprofile.deldata}
                    onClose={() => { setDeleteprofile({ isdelete: false, deldata: {} }) }}
                    onsubmit={DelectAction}
                />
                <Modal isOpen={EditUserPopup.isOpen} placement={EditUserPopup.modalPlacement} onOpenChange={() => { EditUserPopup.onOpenChange(); setUpdateUser(objupdateuser); }} scrollBehavior="inside">
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">User</ModalHeader>
                        <ModalBody>
                            <Input type="email" variant='bordered' name="email" label="Email" defaultValue={updateuser.email} onChange={UpdateuserOnchange} isInvalid={ErrorForm.email} errorMessage={ErrorForm.email} />
                            <Input type="number" variant='bordered' name="age" label="Age" defaultValue={updateuser.age} onChange={UpdateuserOnchange} isInvalid={ErrorForm.age} errorMessage={ErrorForm.age} />
                            <Input type="text" variant='bordered' name="gender" label="Gender" defaultValue={updateuser.gender} onChange={UpdateuserOnchange} isInvalid={ErrorForm.gender} errorMessage={ErrorForm.gender} />
                            <Input type="text" variant='bordered' name="introduction" label="Name" defaultValue={updateuser.introduction} onChange={UpdateuserOnchange} isInvalid={ErrorForm.introduction} errorMessage={ErrorForm.introduction} />
                            <Input type="text" variant='bordered' name="experience" label="Experience" defaultValue={updateuser.experience} onChange={UpdateuserOnchange} isInvalid={ErrorForm.experience} errorMessage={ErrorForm.experience} />
                            <Input type="text" variant='bordered' name="patientcount" label="Patient Count" defaultValue={updateuser.patientcount} onChange={UpdateuserOnchange} isInvalid={ErrorForm.patientcount} errorMessage={ErrorForm.patientcount} />
                            <Input type="text" variant='bordered' name="qualifications" label="Qualifications" defaultValue={updateuser.qualifications} onChange={UpdateuserOnchange} isInvalid={ErrorForm.qualifications} errorMessage={ErrorForm.qualifications} />
                            <Input type="text" variant='bordered' name="phonenumber" label="Phone Number" defaultValue={updateuser.phonenumber} onChange={UpdateuserOnchange} isInvalid={ErrorForm.phonenumber} errorMessage={ErrorForm.phonenumber} />
                            <Input type="text" variant='bordered' name="about" label="About" defaultValue={updateuser.about} onChange={UpdateuserOnchange} isInvalid={ErrorForm.about} errorMessage={ErrorForm.about} />
                            <Input type="text" variant='bordered' name="jobtitle" label="Job Title" defaultValue={updateuser.jobtitle} onChange={UpdateuserOnchange} isInvalid={ErrorForm.jobtitle} errorMessage={ErrorForm.jobtitle} />
                            <Input type="text" variant='bordered' name="describe" label="Describe" defaultValue={updateuser.describe} onChange={UpdateuserOnchange} isInvalid={ErrorForm.describe} errorMessage={ErrorForm.describe} />
                            <div>
                                <input accept="image/jpg,image/png,image/svg,image/jpeg" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#a1a1aa] file:text-white border-2 border-[#e4e4e7] hover:border-[#a1a1aa] p-2 rounded-xl" type="file" name="profileimg" onChange={UpdateuserOnchange} />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={updateuserAction}>
                                Update
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}
