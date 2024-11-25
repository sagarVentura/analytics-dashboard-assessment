import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon ,HomeIcon,ClipboardIcon,PresentationChartBarIcon,uset} from '@heroicons/react/24/outline'
import logoimg from "./resource/Assest/project-management.png";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const navigation = [
  { name: 'Tabular', href: '', current: false,Icon:PresentationChartBarIcon },
  { name: 'Graph', href: 'graph', current: true ,Icon:ClipboardIcon },
]

const  dropdown=[
  { name: 'Profile', href: '/profile', current:false },
  { name: 'Sign out', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Header() {
  const navigate=useNavigate();

  const[current,setCurrent]=useState("")

  // const slug=authState?.user?.organisation?.slug;
  const  dropdown=[
    // { name: 'Profile', href: '/profile', click: profileView },
    // { name: 'Sign out', href: '#', click: signOut },
  ]



  function  handleNavigation(route){
   setCurrent(route)
    navigate(`/${route}`)
  }
//   function signOut(){
//     clearAppData()
//   }
  return (
    <Disclosure as="nav" className="bg-mainbackgroundcolor w-full   sticky  top-0   z-40 border-linecolor  border-b-2">
      <div className="mx-auto  px-2 sm:px-6 lg:px-8">
        <div className="relative flex topnav items-center flex-1 justify-between">
                    {/* Mobile menu button*/}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-navActiveColor focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden " />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    {/*   logo   component*/}
            <div className="flex flex-shrink-0 items-center">
                <img src={logoimg} alt="Project management" className="h-[50px]" />
            </div>

                    {/*   nav button   component*/}
            <div className="hidden sm:ml-6 sm:flex   items-center ">
              <div className="flex space-x-4  justify-center  h-fit">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    // href={item.href}
                    onClick={()=>{
                      handleNavigation(item.href)
                    }}
                    aria-current={item.href==current ? 'page' : undefined}
                    className={classNames(
                      item.href==current ? 'bg-navActiveColor text-white' : 'text-textheadingcolor hover:bg-buttonPrimary hover:!text-white',
                      'rounded-md px-3 py-2 text-sm font-medium cursor-pointer',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 bg-im">
                  
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-[45px] w-[45px] rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-[#303134] py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                {
                  dropdown.map((ele)=>{
                    return (
                      <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-center text-nowrap  text-[#BABABA] hover:!bg-navActiveColor hover:text-white  rounded-md  font-medium "
                                  
                      onClick={ele.click}>
                        {
                          ele.name
                        }
                      </a>
                    </MenuItem>

                    )
                  })
                }
               
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className=" absolute sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 my-2 mx-1  w-[98vw] border-white border-2 rounded  bg-[#303134]">
          {navigation.map((item) => {
            let Icon=item.Icon
           return( <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.href==current ? 'page' : undefined}
              className={classNames(
                item.href==current ? 'text-navActiveColor  flex justify-between' : 'text-[#BABABA] hover:!bg-sidehoverColor hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium flex justify-between hover:!bg-sidehoverColor ',
              )}
            >
              <Icon aria-hidden="true" className="block h-6 w-6 group-data-[open]:hidden" />

              <div>{item.name}</div>
            </DisclosureButton>
           )
})}
        </div>
      </DisclosurePanel>
  </Disclosure>
  )
}
