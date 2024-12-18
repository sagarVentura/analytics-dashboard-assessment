
import { toast } from 'react-toastify';
import React, { CSSProperties, useState, useRef, useMemo, useEffect, useCallback } from 'react'
import ReactDOM from 'react-dom';

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import './Table.css'
import { horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
// needed for table body level scope DnD setup
import {
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'


// needed for row & cell level scope DnD setup
import { CSS } from '@dnd-kit/utilities'
import { useDispatch, useSelector } from 'react-redux';
import { getData } from '../api/fetchApi';
import { DragIcon } from '../resource/icons/icon';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
// import { setHeaderListData, setRouteData } from '../../stores/appSlice.js';

//These are the important styles to make sticky column pinning work!
//Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
//View the index.css file for more needed styles such as border-collapse: separate

const getCommonPinningStyles = (column) => {
    const isPinned = column.getIsPinned();

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        zIndex: isPinned ? 1 : 0,
        width: `${column.getSize()}px`, // Add this to ensure pinned column width matches
        minWidth: `${column.getSize()}px`, // Ensures the pinned column does not shrink
        // maxWidth: `${column.getSize()}px`, // Ensures the pinned column does not grow
    };
};

const getCommonPinningStylesForHeader = (column) => {
    const isPinned = column.getIsPinned();

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        top: '0px',
        position: isPinned ? 'sticky' : 'sticky',
        zIndex: isPinned ? 4 : 0,
        width: `${column.getSize()}px`, // Add this to ensure pinned column width matches
        minWidth: `${column.getSize()}px`, // Ensures the pinned column does not shrink
        // maxWidth: `${column.getSize()}px`, // Ensures the pinned column does not grow
    };
};






function Table() {
    const [data, setData] = React.useState([]);
    const [allData, setAllData] = useState()
    const [loading, setLoading] = React.useState(true);
    const [filter, setFilter] = useState({});
    const [rowsPerPage, setRowPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, settotalPages] = useState(1);
    const [columnFilters, setColumnFilters] = React.useState([]);


    console.log("rendring")
    const [header, setHeader] = React.useState([]);

    const [pageError, setPageError] = useState(null);
    const [pinnedColumn, setPinnedColumn] = useState([]);
    const [rowOrder,setRowOrder]=useState([])



    //   const {authState}=useSelector((store)=>store);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData();
                setData(response.slice(0, rowsPerPage));
                setRowOrder(()=>{
                    let pushArr=[]
                    response.slice(0, rowsPerPage).forEach((ele)=>{
                        pushArr.push(ele[`VIN (1-10)`]
                    )

                    })
                    return pushArr;

                }
                )
                setAllData(response);
                settotalPages(() => {
                    return response ? Math.ceil((response.length) / rowsPerPage) : 1
                })
                let header = Object.keys(response[0]);
                setHeader(header);
                setPinnedColumn(header.slice(0, 2))
                setPageError(null);

            } catch (err) {
                setPageError(err)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!allData) return;
        setData(
            () => {
                return allData.slice(((currentPage - 1) * rowsPerPage), currentPage * rowsPerPage)
            }
        )

    }, [currentPage])




    const Cell = ({data, field,Key }) => {
        const { attributes, listeners } = useSortable({
            id: data[`VIN (1-10)`],

        })

        return(    <div {... attributes} {...listeners }>
               {Key=="VIN (1-10)" && <div {...attributes} {...listeners} className='point-move' >
                        {<DragIcon /> }
                    </div>}
             <span className='text-white text-lg'>{field}</span>
        </div>
        )


    }





    const testcolumn = useMemo(function () {
        let columnArr = header.map((key) => {
            return {
                accessorKey: key,
                id: key,
                header: () => {
                    return <HeaderRender id={key} header={key} />
                },
                cell: (info) => {
                    let { row } = info;
                    const rowData = row.original; // Full row data
                    let value = info.getValue()

                    return <Cell data={rowData} Key={key} field={value} />

                },
                size: 180
            }
        })


        return columnArr
    }, [header,rowOrder]);

  



    function HeaderRender({ id, header, Icon }) {
        let IconRender = Icon;
        const { attributes, listeners } = useSortable({
            id: id,

        })
        return (
            <div className=' header cursor-default'  >
                <div className='flex justify-center'>
                    <div {...attributes} {...listeners} className='point-move' >
                        {!pinnedColumn.includes(id) ? <DragIcon /> : null}
                    </div>
                    {IconRender && <IconRender width={'15px'} height={"15px"} />}
                    <div className='
                  text-sky-400  font-bold px-2
                '  style={{ marginLeft: "5px" }}>{header}</div>
                </div>
            </div>
        )

    }






    const table = useReactTable({
        data: data ?? [{}],
        columns: testcolumn,
        filterFns: {},
        state: {
          columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getRowId: row => row.id, //required because row indexes will change
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
        columnResizeMode: 'onChange', // Enable column resizing
    },
        {
            tableLayout: 'fixed', // Adds table-layout fixed to the table
        },
    )
    useEffect(() => {
        if (pinnedColumn.length) {
            pinnedColumn.forEach((key) => {
                const column = table.getColumn(key);
                if (column) column.pin('left');
            });
        }
    }, [pinnedColumn, table]);


    // reorder rows after drag & drop
    function handleDragEnd(event) {
        const { active, over } = event
        if (active && over && active.id !== over.id) {
            let activeRow = active?.data?.current?.type;
            let overRow = over?.data?.current?.type;
            if (activeRow != overRow) return;
            //   it for   order the columns according to drag and drop 
            // if (active?.data?.current?.type == "header" || over?.data?.current?.type == "header") {
            setHeader(header => {
                const oldIndex = header.indexOf(active.id);
                const newIndex = header.indexOf(over.id);
                return arrayMove(header, oldIndex, newIndex) //this is just a splice util
            })
            // }

        }
    }
    function handleDragstart(event) {
        const { active } = event
        // if (active && active.id) {
        //     let activeRow = active?.data?.current?.type;
        //     if (activeRow == "T") return;
        //     SetShowSubRow(false);

        // }
    }
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    )


    const DragAlongCell = ({ cell }) => {
        const { isDragging, setNodeRef, transform } = useSortable({
            id: cell.column.id,
            data: {
                type: "header"
            }
        })

        const isPinned = Boolean(cell?.column.getIsPinned());


        const style = {
            opacity: isDragging ? 0.8 : 1,
            position: isPinned ? "sticky" : 'relative',
            transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
            transition: 'width transform 0.2s ease-in-out',
            width: `${cell.column.getSize()}px`, // Add this to ensure pinned column width matches
            minWidth: `${cell.column.getSize()}px`, // Ensures the pinned column does not shrink
            maxWidth: `${cell.column.getSize()}px`, // Ensures the pinned column does not grow
            zIndex: isDragging || isPinned ? 1 : 0,
        }

        return (
            !isPinned ?
                <td key={cell.id}
                    style={{ ...getCommonPinningStyles(cell.column), ...style }}
                    className=" group-hover:bg-listhover"
                    ref={setNodeRef}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td> :
                <td key={cell.id}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                    className=" group-hover:bg-listhover"
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
        )
    }
    // Row Component
    const DraggableTaskList = ({ row }) => {
        const { transform, transition, setNodeRef, isDragging } = useSortable({
            id: row.id,
          })
      
          const style = {
            transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
            transition: transition,
            opacity: isDragging ? 0.8 : 1,
            zIndex: isDragging ? 1 : 0,
            position: 'relative',
          }
        return (
            // connect row ref to dnd-kit, apply important styles
            <tr className="   bg-mainbackgroundcolor group hover:bg-listhover "  
            ref={setNodeRef}
            style={style}
            >

                {row.getVisibleCells().map(cell => (
                    <SortableContext
                        key={cell.id}
                        items={header}
                        strategy={horizontalListSortingStrategy}
                    >
                        <DragAlongCell key={cell.id} cell={cell} />
                     </SortableContext>
                ))}
            </tr>

        )
    }



    const DraggableTableHeader = ({ header }) => {
        const isPinned = Boolean(header.column.getIsPinned());

        const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
            id: header.column.id,
            disabled: isPinned, // Disable drag-and-drop for pinned columns
            data: {
                type: 'header',
            },
        });

        // Styles for the header cell
        const style = {
            opacity: isDragging ? 0.8 : 1,
            position: isPinned ? 'sticky' : 'sticky',
            transform: CSS.Translate.toString(transform),
            transition: 'width transform 0.2s ease-in-out',
            zIndex: isDragging?5:3,
            top: '0px'
        };

        return !isPinned ? (
            <th
                colSpan={header.colSpan}
                style={{ ...getCommonPinningStylesForHeader(header.column), ...style }}
                className="border border-gray-400 bg-mainbackgroundcolor"
                ref={setNodeRef} // Attach sortable ref here
            >
                {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}

                {/* Resizer */}
                <div
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`cursor-col-resize resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                />
                 {/* {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} />
                          </div>
                        ) : null} */}
            </th>
        ) : (
            <th
                colSpan={header.colSpan}
                style={{ ...getCommonPinningStylesForHeader(header.column) }}
                className="border border-gray-400 bg-mainbackgroundcolor"
            >
                {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}

                {/* Resizer */}
                <div
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`cursor-col-resize resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                />
                 {/* {
                          <div>
                            <Filter column={header.column} />
                          </div>
                    } */}
            </th>
        );
    };



    return (


        <DndContext
            collisionDetection={closestCenter}
            // modifiers={[restrictToHorizontalAxis,restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragstart}
            sensors={sensors}
        >
            <div className="p-2 bg-mainbackgroundcolor">
                <div className='flex justify-center  flex-col  items-center  mt-2 '>
                    {/* <div className="w-full  text-xl font-bold flex flex-1 text-center text-green-400">
                    Table Formate</div> */}
                    <div className="flex sticky right-1 justify-end  w-full  text-yellow-200 space-x-4">
                        <button
                            className=" text-white text-sm bg-blue-900 rounded-md py-2 px-3 flex justify-center items-center"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronDoubleLeftIcon className="h-5 w-5" />{" "}
                            <label> Previous</label>
                        </button>
                        <span className="text-lg">
                            {" "}
                            Page {currentPage} of {totalPages}{" "}
                        </span>
                        <button
                            className=" text-white text-sm bg-blue-900 rounded-md py-2 px-3 flex justify-center items-center"
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={currentPage === totalPages}
                        >
                            <label> Next</label> <ChevronDoubleRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>


                <div className="h-4" />
                <div className="p-2">

                    <div className="table-container  h-[500px] overflow-y-scroll">

                        <table
                        // style={{
                        //     width: table.getTotalSize(),
                        // }}
                        >
                            <thead>

                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        <SortableContext
                                            items={header}
                                            strategy={horizontalListSortingStrategy}
                                        >
                                            {headerGroup.headers.map(header => (
                                                <DraggableTableHeader key={header.id} header={header} />
                                            ))}
                                        </SortableContext>

                                    </tr>
                                ))}

                            </thead>
                            <tbody>


                                {data.length ?
                                    table.getRowModel().rows.map(row => {
                                        return (
                                            <>
                                             <SortableContext
                                            items={rowOrder}
                                            strategy={verticalListSortingStrategy}
                                        >
                                                <DraggableTaskList row={row} parentId={row.id} />
                                                </SortableContext>
                                            </>
                                        )
                                    }) : null
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DndContext>

    )

}

function Filter({ column }) {
    const columnFilterValue = column.getFilterValue()

    return (<div className="flex space-x-2">

        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '')}
        />
    </div>)
}




function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  // Effect to update local value whenever initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Effect to handle debounced onChange
  useEffect(() => {
    const timeout = setTimeout(() => {
     // onChange(value); // Only call onChange when the value stops changing for `debounce` ms
    }, debounce);

    // Cleanup timeout on value change or unmount
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  // Handle input change and update local value
  const handleChange = (e) => {
    setValue(e.target.value); // Update local state immediately for user interaction
  };

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
}


  

export default Table;











