import random

def solution(A):
    # Empty array to keep lists of occupied rooms
    rooms = []
    A.sort(reverse=True)
    for guest in A:
        # rooms assigned
        assigned = False
        i = len(rooms) - 1
        if i>=0 and rooms[i] + 1 <= guest:
            rooms[i] += 1
            assigned=True
        if not assigned:
            rooms.append(1)

    return len(rooms)


def solution1(A):
    num_rooms = 0
    A = sorted(A)
    # print(A)
    space_remaining = 0
    for capacity in A:
        # print(space_remaining, capacity)
        if space_remaining <= 0:
            num_rooms += 1
            space_remaining = capacity - 1
        else:
            space_remaining -= 1

    return num_rooms

# Example test cases
# assert solution([1, 1, 1, 1, 1]) == 5, "Test case 1 failed"
# assert solution([2, 1, 4]) == 2, "Test case 2 failed"
# assert solution([2, 7, 2, 9, 8]) == 2, "Test case 3 failed"
# assert solution([7, 3, 1, 1, 4, 5, 4, 9]) == 4, "Test case 4 failed"
# assert solution([4, 3, 3, 3, 3, 3, 3, 3, 2]) == 4, "Test case 5 failed"
# Generate and test 1000 cases
for _ in range(100000):
    test_case = [random.randint(1, 5) for _ in range(random.randint(1, 30))]
    test_case_copy = test_case.copy()

    result1 = solution(test_case_copy)
    test_case_copy = test_case.copy()

    result2 = solution1(test_case_copy)

    if result1 != result2:
        print(f"Test case: {test_case}")
        print(f"solution: {result1}, solution2: {result2}")
        break  # Stop at the first difference for debugging

# print(test_case)