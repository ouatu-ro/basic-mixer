def solution(A):
    # Empty array to keep lists of occupied rooms
    A.sort()
    i = 0
    rooms = 0
    while i < len(A):
        i += A[i]
        rooms += 1
    return rooms

assert solution([1, 1, 1, 1, 1]) == 5, "Test case 1 failed"
assert solution([2, 1, 4]) == 2, "Test case 2 failed"
assert solution([2, 7, 2, 9, 8]) == 2, "Test case 3 failed"
assert solution([7, 3, 1, 1, 4, 5, 4, 9]) == 4, "Test case 4 failed"
assert solution([4, 3, 3, 3, 3, 3, 3, 3, 2]) == 4, "Test case 5 failed"

print("All test cases passed")