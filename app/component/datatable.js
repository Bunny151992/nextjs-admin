"use client"
import React, { useState } from 'react'
import { Button, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger, Chip, Tooltip, Select, SelectItem, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination } from "@nextui-org/react";
import Image from 'next/image'

import ChevronDownIcon from "@/public/components/datatable/ChevronDownIcon.svg";
import DeleteIcon from "@/public/components/datatable/DeleteIcon.svg";
import EditIcon from "@/public/components/datatable/EditIcon.svg";
import EyeIcon from "@/public/components/datatable/EyeIcon.svg";
import SearchIcon from "@/public/components/datatable/SearchIcon.svg";

const PerPage = [5, 10, 15, 20, 25, 50, 100]

export default function DataTableComponents({ columndata, rowdata, selecttype, actionlist, onActionclick }) {

    const [filterValue, setFilterValue] = useState("");
    const [parpages, setParpages] = useState("15");
    const [sortDescriptor, setSortDescriptor] = useState({ column: "name", direction: "ascending" });
    const [visibleColumns, setVisibleColumns] = useState(new Set(Object.keys(columndata)));

    // Header columns setup
    const HeaderColumns = React.useMemo(() => {
        if (visibleColumns === "all") return Object.values(columndata);
        return Object.values(columndata).filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    // Search field
    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    // filter data
    const filteredItems = React.useMemo(() => {
        let filteredRows = [...rowdata];
        (filterValue && (filteredRows = filteredRows.filter((data) => Object.values(data).join(',').toLowerCase().includes(filterValue.toLowerCase()))));
        return filteredRows;
    }, [rowdata, filterValue])

    // paginations
    const [page, setPage] = React.useState(1);
    const pages = Math.ceil(filteredItems.length / Number(parpages));

    const items = React.useMemo(() => {
        const start = (page - 1) * Number(parpages);
        const end = start + Number(parpages);
        return filteredItems.slice(start, end);
    }, [page, filteredItems, parpages]);

    // sorting 
    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    // top and bottom elements 
    const TopContenthtml = () => {
        return (
            <div className="flex flex-col sm:flex-row justify-between gap-3 items-center sm:items-end">
                <div className='flex flex-col min-[360px]:flex-row gap-2 max-[360px]:items-center'>
                    <Select
                        label="Page"
                        color="default"
                        disallowEmptySelection
                        labelPlacement="outside-left"
                        className="items-center w-[125px]"
                        defaultSelectedKeys={[parpages]}
                        onSelectionChange={(ids) => { setParpages((Array.from(ids)[0]).toString()) }}
                    >
                        {PerPage.map((ppage) => (
                            <SelectItem key={ppage} value={ppage}>{ppage.toString()}</SelectItem>
                        ))}
                    </Select>
                    <Dropdown>
                        <DropdownTrigger className="sm:flex w-[180px]">
                            <Button endContent={<Image src={ChevronDownIcon} alt='Select' height={13} width={13} />} variant="flat">Columns</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Table Columns"
                            closeOnSelect={false}
                            selectedKeys={visibleColumns}
                            selectionMode="multiple"
                            onSelectionChange={setVisibleColumns}
                        >
                            {Object.values(columndata).map((column) => (
                                <DropdownItem key={column.uid} className="capitalize">
                                    {column.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <Input isClearable
                    className="w-full sm:max-w-[300px]"
                    placeholder="Search..."
                    startContent={<Image src={SearchIcon} alt='SearchIcon' width={20} height={20} />}
                    value={filterValue}
                    onClear={() => onClear()}
                    onValueChange={onSearchChange}
                />
            </div>
        )
    }
    const BottomContenthtml = () => {
        return (
            <div className="py-2 px-2 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <span className="text-default-400 text-small">Total {filteredItems.length} entries</span>
                <Pagination
                    isCompact
                    showControls
                    classNames={{ cursor: "bg-foreground text-background" }}
                    color="default"
                    total={pages == 0 ? 1 : pages}
                    page={page}
                    onChange={(page) => setPage(page)}
                />
            </div>
        )
    }

    // cell view set
    const renderCell = React.useCallback((item, columnKey) => {
        switch (columndata[columnKey].callview) {
            case 'image':
                return <img src={item[columnKey]?item[columnKey]:'https://via.placeholder.com/500x300'} alt={item[columnKey]} width={100} height={100} className='rounded-2xl' />
            case 'tags':
                return item[columnKey].split(',').map((item, index) => {
                    return item ? <Chip key={`chip${item}${index}`} color='default' variant="flat" className='ml-1 mb-1'>{item}</Chip> : '';
                })
            case 'ispremiun':
                return (item[columnKey] ? <Chip color='success' variant="flat">True</Chip> : <Chip color='danger' variant="flat">False</Chip>)
            case 'actions':
                return (
                    <div className="relative flex items-center justify-center gap-2">
                        {actionlist.includes('view') ?
                            <Tooltip content="Details">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Image src={EyeIcon} alt='View' width={20} height={20} onClick={() => { handleClick('view', item) }} />
                                </span>
                            </Tooltip> : ""
                        }
                        {actionlist.includes('edit') ?
                            <Tooltip content="Edit">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Image src={EditIcon} alt='Edit' width={20} height={20} onClick={() => { handleClick('edit', item) }} />
                                </span>
                            </Tooltip> : ""
                        }
                        {actionlist.includes('delete') ?
                            <Tooltip content="Delete">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Image src={DeleteIcon} alt='Delete' width={20} height={20} onClick={() => { handleClick('delete', item) }} />
                                </span>
                            </Tooltip> : ""
                        }
                    </div>
                )
            default:
                return item[columnKey];
        }
    }, [])

    // action click setup
    const handleClick = (type, data) => {
        onActionclick({ type, data });
    };

    return (
        <div className='w-[99%]'>
            <Table
                aria-label="Data Table"
                selectionMode={selecttype}
                topContentPlacement="outside"
                topContent={TopContenthtml()}
                bottomContentPlacement='outside'
                bottomContent={BottomContenthtml()}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={HeaderColumns}>
                    {(column) => <TableColumn key={column.uid} allowsSorting={column.sortable} className={`${column.uid === "actions" ? "text-center" : ""}`}>
                        {column.name}
                    </TableColumn>}
                </TableHeader>
                <TableBody items={sortedItems} emptyContent={"No rows to display."}>
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}