import { cn } from '@/lib/utils';

export interface Column<T> {
    header: string;
    accessorKey: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    className?: string;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    onRowClick,
    className
}: DataTableProps<T>) {
    return (
        <div className={cn("bg-card rounded-2xl border border-border shadow-sm overflow-hidden", className)}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/50 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider">
                        <tr>
                            {columns.map((column, idx) => (
                                <th key={idx} className={cn("px-6 py-4", column.className)}>
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={cn(
                                    "hover:bg-muted/50 transition-colors",
                                    onRowClick && "cursor-pointer"
                                )}
                            >
                                {columns.map((column, idx) => (
                                    <td key={idx} className={cn("px-6 py-4 font-medium", column.className)}>
                                        {typeof column.accessorKey === 'function'
                                            ? column.accessorKey(item)
                                            : (item[column.accessorKey] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                    No data available.
                </div>
            )}
        </div>
    );
}
