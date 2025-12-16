// React
import { ReactNode, Suspense } from "react";

interface ISuspendedItemProps<T> {
    item: Promise<T>;
    fallback: ReactNode;
    result: (item: T) => ReactNode;
}

interface IInnerComponentProps<T> {
    item: Promise<T>;
    result: (item: T) => ReactNode;
}

export async function SuspendedItem<T>({
    fallback,
    item,
    result,
}: ISuspendedItemProps<T>) {
    return (
        <Suspense fallback={fallback}>
            <InnerComponent item={item} result={result} />
        </Suspense>
    );
}

async function InnerComponent<T>({ item, result }: IInnerComponentProps<T>) {
    return result(await item);
}
