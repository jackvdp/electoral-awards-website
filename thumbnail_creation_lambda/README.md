# Deploying Lambda as a Zip File

This guide will walk you through the steps to deploy a Lambda function as a zip file.

## Prerequisites

Before you begin, make sure you have the following:

- AWS CLI installed and configured with your AWS credentials.
- A Lambda function written in the programming language of your choice.

## Steps

1. Create a deployment package by zipping your Lambda function code and any dependencies it requires.

2. Open a terminal or command prompt and navigate to the directory where your Lambda function code is located.

3. Run the following command to create a zip file:

    ```bash
    zip -r lambda_function.zip .
    ```

    This command recursively zips all the files and directories in the current directory.

4. Upload the zip file to an S3 bucket. You can use the AWS CLI to do this:

    ```bash
    aws s3 cp lambda_function.zip s3://your-bucket-name/
    ```

    Replace `your-bucket-name` with the name of your S3 bucket.

5. Create or update your Lambda function using the AWS CLI:

    ```bash
    aws lambda create-function --function-name your-function-name --runtime your-runtime --role your-role --handler your-handler --code S3Bucket=your-bucket-name,S3Key=lambda_function.zip
    ```

    Replace `your-function-name`, `your-runtime`, `your-role`, and `your-handler` with the appropriate values.

6. Test your Lambda function to ensure it's working as expected.

7. Congratulations! You have successfully deployed your Lambda function as a zip file.

## Conclusion

In this guide, you learned how to deploy a Lambda function as a zip file. This method allows you to easily package and distribute your Lambda function along with its dependencies.

For more information, refer to the [AWS Lambda documentation](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html).
