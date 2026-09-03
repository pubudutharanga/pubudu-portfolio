import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className = '', children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-4 py-2.5 text-xs font-semibold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer ${className}`}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <FaChevronDown className="text-gray-400 shrink-0 text-[10px] transition-transform duration-200" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef(({ className = '', ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={`flex cursor-default items-center justify-center py-1 text-gray-500 ${className}`}
        {...props}
    >
        <FaChevronUp className="text-[10px]" />
    </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef(({ className = '', ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={`flex cursor-default items-center justify-center py-1 text-gray-500 ${className}`}
        {...props}
    >
        <FaChevronDown className="text-[10px]" />
    </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef(({ className = '', children, position = 'popper', ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 p-1.5 text-gray-900 dark:text-gray-100 shadow-2xl backdrop-blur-2xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 ${
                position === 'popper'
                    ? 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1'
                    : ''
            } ${className}`}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={`p-1 ${
                    position === 'popper'
                        ? 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                        : ''
                }`}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className = '', ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={`px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${className}`}
        {...props}
    />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(({ className = '', children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={`relative flex w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-8 text-xs font-medium outline-none transition-colors focus:bg-blue-50 dark:focus:bg-blue-950/40 focus:text-blue-600 dark:focus:text-blue-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-gray-700 dark:text-gray-200 ${className}`}
        {...props}
    >
        <span className="absolute right-2.5 flex h-3.5 w-3.5 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <FaCheck className="text-xs text-blue-600 dark:text-blue-400" />
            </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className = '', ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={`-mx-1 my-1 h-px bg-gray-100 dark:bg-gray-800 ${className}`}
        {...props}
    />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton
};
