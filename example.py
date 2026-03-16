def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

def greet(name):
    return f"Hello, {name}! Welcome to Python."

if __name__ == "__main__":
    print(greet("World"))
    print(f"Fibonacci(10): {fibonacci(10)}")
    print(f"Is 17 prime? {is_prime(17)}")
