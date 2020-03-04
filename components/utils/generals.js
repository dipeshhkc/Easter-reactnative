export const dropdownFormat = (config, options, setState) => {
    let tempOptions = [];
    // setState(tempOptions);
    config.forEach((each, ind) => {
        tempOptions.push({
            key: ind,
            text: each,
            value: each,
        });
    });

    setState(options, tempOptions);
};
