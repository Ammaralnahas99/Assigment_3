let majorityElement = function (nums) {
    let count = 1;
    let number = nums[0];

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === number) {
            count++;
        } else {
            count--;
        }

        if (count === 0) {
            number = nums[i];
            count = 1;
        }
    }

    return number;
};
let arr = [1,2,1,2,1,2,1,1,1,4,3,4,1,1,1];
console.log(majorityElement(arr))