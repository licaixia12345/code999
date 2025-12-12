def bubble_sort(arr):
    """
    冒泡排序算法实现
    
    参数:
        arr: 待排序的列表
    
    返回:
        排序后的列表
    """
    n = len(arr)
    # 创建一个新列表，避免修改原列表
    sorted_arr = arr.copy()
    
    # 外层循环控制遍历次数
    for i in range(n):
        # 设置标志位，优化算法：如果某次遍历没有发生交换，说明已经有序
        swapped = False
        
        # 内层循环进行相邻元素比较和交换
        # 每次遍历后，最大的元素会"冒泡"到最后
        for j in range(0, n - i - 1):
            if sorted_arr[j] > sorted_arr[j + 1]:
                # 交换相邻元素
                sorted_arr[j], sorted_arr[j + 1] = sorted_arr[j + 1], sorted_arr[j]
                swapped = True
        
        # 如果某次遍历没有发生交换，提前结束排序
        if not swapped:
            break
    
    return sorted_arr


def bubble_sort_descending(arr):
    """
    降序冒泡排序
    
    参数:
        arr: 待排序的列表
    
    返回:
        降序排序后的列表
    """
    n = len(arr)
    sorted_arr = arr.copy()
    
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if sorted_arr[j] < sorted_arr[j + 1]:  # 改为小于号实现降序
                sorted_arr[j], sorted_arr[j + 1] = sorted_arr[j + 1], sorted_arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return sorted_arr


if __name__ == "__main__":
    # 测试代码
    test_data = [64, 34, 25, 12, 22, 11, 90]
    print("原始数组:", test_data)
    
    # 升序排序
    sorted_asc = bubble_sort(test_data)
    print("升序排序结果:", sorted_asc)
    
    # 降序排序
    sorted_desc = bubble_sort_descending(test_data)
    print("降序排序结果:", sorted_desc)
    
    # 测试边界情况
    print("\n边界情况测试:")
    print("空列表:", bubble_sort([]))
    print("单元素列表:", bubble_sort([5]))
    print("已排序列表:", bubble_sort([1, 2, 3, 4, 5]))
    print("逆序列表:", bubble_sort([5, 4, 3, 2, 1]))
