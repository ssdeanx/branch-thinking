//... (previous code)

  addThought(input: BranchingThoughtInput): ThoughtData {
    // Use active branch if no branchId provided, or create a new main branch
    const branchId = input.branchId || this.activeBranchId || this.generateId('main');
    let branch = this.branches.get(branchId);

    if (!branch) {
      branch = this.createBranch(branchId, input.parentBranchId);
    }
    //... (rest of the code)