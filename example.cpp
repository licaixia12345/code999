#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

class Calculator {
public:
    static int add(int a, int b) { return a + b; }
    static int subtract(int a, int b) { return a - b; }
    static int multiply(int a, int b) { return a * b; }
    static double divide(int a, int b) { 
        if (b == 0) throw std::runtime_error("Division by zero");
        return static_cast<double>(a) / b; 
    }
};

std::vector<int> generatePrimes(int limit) {
    std::vector<bool> sieve(limit + 1, true);
    sieve[0] = sieve[1] = false;
    
    for (int i = 2; i * i <= limit; ++i) {
        if (sieve[i]) {
            for (int j = i * i; j <= limit; j += i) {
                sieve[j] = false;
            }
        }
    }
    
    std::vector<int> primes;
    for (int i = 2; i <= limit; ++i) {
        if (sieve[i]) primes.push_back(i);
    }
    return primes;
}

int main() {
    std::cout << "Calculator Demo:" << std::endl;
    std::cout << "5 + 3 = " << Calculator::add(5, 3) << std::endl;
    std::cout << "10 - 4 = " << Calculator::subtract(10, 4) << std::endl;
    std::cout << "6 * 7 = " << Calculator::multiply(6, 7) << std::endl;
    
    std::cout << "\nPrimes up to 30:" << std::endl;
    auto primes = generatePrimes(30);
    for (int p : primes) {
        std::cout << p << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
