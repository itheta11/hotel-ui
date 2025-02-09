import { Layout } from "react-grid-layout";

export function getUpdatedContainers(
  prevLayout: Layout[],
  newLayout: Layout[]
) {
  const prevMap = new Map(prevLayout.map((item) => [item.i, item])); // O(n)

  return newLayout.filter((item) => {
    const prevItem = prevMap.get(item.i);
    return (
      !prevItem || // New container
      prevItem.x !== item.x ||
      prevItem.y !== item.y ||
      prevItem.w !== item.w ||
      prevItem.h !== item.h
    );
  });
}
