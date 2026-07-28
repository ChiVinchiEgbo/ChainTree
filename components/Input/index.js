import React from 'react'

export const Input = React.forwardRef((props, ref) => {
  return (
    <div className="flex w-full flex-col">
      <input
        type={props?.type || 'text'}
        ref={ref}
        id={props?.id}
        placeholder={props?.placeholder}
        defaultValue={props?.defaultValue}
        onChange={props?.onChange}
        className={`border-b-2 mb-3 w-full border-black-100 bg-transparent p-2 font-sans text-sm font-medium text-white-300 focus:border-primary-300 focus:outline-none dark:text-white-100`}
      ></input>
    </div>
  )
})
